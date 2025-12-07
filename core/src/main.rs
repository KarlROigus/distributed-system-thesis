use warp::Filter;
use serde::Deserialize;

#[derive(Deserialize, Debug)]
struct Data {
    value: i32,
}

#[tokio::main]
async fn main() {
    // POST /data endpoint
    let data_route = warp::post()
        .and(warp::path("data"))
        .and(warp::body::json())
        .map(|data: Data| {
            println!("Received data: {:?}", data.value);
            warp::reply::with_status("OK", warp::http::StatusCode::OK)
        });

    println!("Core server running on 0.0.0.0:3030");
    warp::serve(data_route)
        .run(([0, 0, 0, 0], 3030))
        .await;
}
