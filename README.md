# Mapica

Register and describe locations of interest.

## Requirements

- Postgres

## Running migrations

Migrations were created with [migr](https://github.com/biblius/migr), a janky minimal Postgres migration tool.

The easiest way to install `migr` is via `cargo`

```bash
cargo install migr
```

`migr` requires a `DATABASE_URL` in the env which is a Postgres connection string.

```bash
export DATABASE_URL=<YOUR_CONNECTION_STRING_HERE>
```

To set up the tables, run the following commands on a fresh database instance.

```bash
migr sync
migr run
```

## Running

The application needs a `.env` file.

```bash
cp .env.example .env
```

Install dependencies.

```bash
npm i
```

Run!

```bash
npm run dev
```
