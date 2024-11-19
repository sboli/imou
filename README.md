# IMOU Lights Passthrough for Home Assistant

This repository provides a passthrough solution to integrate **IMOU** lights into **Home Assistant**, enabling seamless control and automation.

## Features

- Provides a lightweight and efficient solution for managing your IMOU lights.
- Supports basic on/off functionality, brightness control, and more (if applicable).

## Prerequisites

Before getting started, ensure you have:

- A working installation of [Home Assistant](https://www.home-assistant.io/).
- Access to your IMOU light(s) and relevant API/connection details.

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/sboli/imou.git
   cd imou
   ```

2. **Set Up the Environment**

   - Create a `.env` file and populate it with your configuration details. For example:

     ```env
     API_URL=
     APP_ID=
     APP_SECRET=
     ```

3. **Build and Run the Docker Container**
   This project is containerized for simplicity. Build and run the Docker container:

   ```bash
   docker build -t imou .
   docker run -d -p 3000:3000 --env-file .env imou
   ```

4. **Integrate with Home Assistant**
   - Add the passthrough service as a custom integration in your Home Assistant configuration.
   - Use the IP address and port of the container (e.g., `http://localhost:3000`) as the endpoint.

## Usage

Once integrated, your IMOU lights can be controlled through Home Assistant’s interface like any other smart device.

## Configuration

Ensure your `.env` file includes the following:

- `APP_ID`: Your IMOU App ID.
- `APP_SECRET`: Imou app secret

## Development

To run the project locally for development:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run start:dev
   ```

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [Home Assistant](https://www.home-assistant.io/) for providing an open-source platform for home automation.
- IMOU for their hardware and API.

---

**Note:** This project is unofficial and not affiliated with or endorsed by IMOU or Home Assistant.
