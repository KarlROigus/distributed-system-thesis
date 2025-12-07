FROM rust:1.83

WORKDIR /usr/src/core
COPY Cargo.toml ./
COPY src ./src

RUN cargo build --release
CMD ["./target/release/core"]
