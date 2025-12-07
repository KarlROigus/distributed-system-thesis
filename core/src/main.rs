use warp::Filter;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::Mutex;

#[derive(Deserialize, Debug, Serialize, Clone)]
struct Data {
    value: i32,
    #[serde(skip_serializing_if = "Option::is_none")]
    client_id: Option<String>,
}

#[derive(Clone)]
struct AppState {
    values: Arc<Mutex<Vec<i32>>>,
    client: reqwest::Client,
}

#[tokio::main]
async fn main() {
    // Create HTTP client for forwarding to visualizer
    let client = reqwest::Client::builder()
        .build()
        .expect("Failed to create HTTP client");

    let state = AppState {
        values: Arc::new(Mutex::new(Vec::new())),
        client,
    };

    let state_clone = state.clone();

    // POST /data endpoint
    let data_route = warp::post()
        .and(warp::path("data"))
        .and(warp::body::json())
        .and(warp::any().map(move || state_clone.clone()))
        .and_then(|data: Data, state: AppState| async move {
            println!("Received data: {:?}", data.value);

            // Store value for aggregation
            {
                let mut values = state.values.lock().await;
                values.push(data.value);
                // Keep only last 1000 values
                if values.len() > 1000 {
                    values.remove(0);
                }
            }

            // Calculate average
            let values = state.values.lock().await;
            let avg = if !values.is_empty() {
                values.iter().sum::<i32>() as f64 / values.len() as f64
            } else {
                0.0
            };
            drop(values);

            // Forward to visualizer
            let forward_data = Data {
                value: data.value,
                client_id: data.client_id.clone(),
            };

            match state.client
                .post("http://visualizer:3000/data")
                .json(&forward_data)
                .send()
                .await
            {
                Ok(res) => {
                    if res.status().is_success() {
                        println!("Forwarded data to visualizer: value={}, avg={:.2}", data.value, avg);
                    } else {
                        eprintln!("Visualizer returned error: {}", res.status());
                    }
                }
                Err(e) => {
                    eprintln!("Failed to forward to visualizer: {:?}", e);
                }
            }

            Ok::<_, warp::Rejection>(warp::reply::with_status(
                "OK",
                warp::http::StatusCode::OK,
            ))
        });

    println!("Core server running on 0.0.0.0:3030");
    warp::serve(data_route)
        .run(([0, 0, 0, 0], 3030))
        .await;
}
