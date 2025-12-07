use serde::Serialize;
use tokio::time::{sleep, Duration};
use reqwest::Client;

#[derive(Serialize)]
struct Data {
    value: i32,
}

#[tokio::main]
async fn main() {
    let client = Client::builder()
        .http2_prior_knowledge() // force HTTP/2
        .build()
        .unwrap();

    loop {
        let data = Data { value: rand::random::<i32>() % 100 };
        let res = client.post("http://core:3030/data")
            .json(&data)
            .send()
            .await;

        match res {
            Ok(r) => println!("Sent data: {:?}, response: {:?}", data.value, r.status()),
            Err(e) => eprintln!("Failed to send: {:?}", e),
        }

        sleep(Duration::from_secs(2)).await;
    }
}
