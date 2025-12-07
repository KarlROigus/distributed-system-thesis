# Use official Rust image
FROM rust:1.83

# Set working directory
WORKDIR /usr/src/client1

# Copy Cargo files first for caching dependencies
COPY Cargo.toml ./

# Copy source code
COPY src ./src

# Build in release mode
RUN cargo build --release

# Set the command to run the service
CMD ["./target/release/client1"]
