import Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :digiby, DigibyWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "cfjYWHcYXb9XSAlGVSI+JuMaiBEYm2RZTRuw/v+ALhlt2BrFv6uLr0rgPyor0tFM",
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime

config :digiby, :gtfs, Digiby.Test.GTFS
