# Installation

This section will guide you through the deployment process.

The deployment relise heavly on Docker (more below);

## Requirements
- Docker
    - docker-compose
- Git

## Clone the repo

Use git to clone the repository:

```sh
git clone https://github.com/edoardovicenzi/s2i-e-recycler.git
```

Then navigate inside the directory:

```sh
cd s2i-e-recycler
```

## Project Structure

There are 3 main directories and the root folder serves as the main entry point of all.

### Authentication

This is a standalone service so that it ca be reused. It handles all JWT operations.

It is located in the `auth/` directory.

### Backend

This is the actual API service to be exposed to the public.
It handles all the operations of e-recycler.

It is located in the `backend/` directory.

### Documentation

This documentation is located in the `docs/` folder and is deployed on every change.

## Setting Environmental variables

This step is NOT recommended for production, instead pass the envirnomental variables at runtime.
If you intend to deploy the production version, skip this section now.

Before starting you will need to set environmental variables, we do this by creating `.env` files.

- Create a `.env` file in the root directoy

Feel free to change the ports if they are already used up.

In the root directory create a `.env` file and set the content to the following:

```.env
DB_AUTH_ROOT_PASSWORD=secret
DB_AUTH_USER=auth
DB_AUTH_USER_PASSWORD=verysecurepassword
DB_AUTH_DATABASE_NAME=auth
AUTH_PORT="5000"
DB_AUTH_PORT="5050"


DB_E_RECYCLER_ROOT_PASSWORD=secret
DB_E_RECYCLER_USER=recycler
DB_E_RECYCLER_USER_PASSWORD=verysecurepassword
DB_E_RECYCLER_DATABASE_NAME=e_recycler
E_RECYCLER_PORT="4000"
DB_E_RECYCLER_PORT="4050"

ACCESS_TOKEN_SECRET=38d595b5d456f27901b3ed100948b3394cdf3a529fa2ad2d29601e0b69dd7c2c2412bb27679b0d3b75606d3b7ffaa01d0ff9de09a5e241b6033400dfac5c985b
REFRESH_TOKEN_SECRET=4947d226f75a2393705a514b4b7cf7fdbbbdade06d92b586f3d08a7eb34ce3c00208814053ad526bd0f76983d7a3f2f794fa5725eec227e9c7def6b7750cb51a
ACCESS_TOKEN_TIMEOUT="24h"
```

Considerations:
- ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET are used to create the token secrets if you want to change them MAKE SURE TO SAVE THEM SOMEWHERE. Loosing them would invalidate all present tokens.
- ACCESS_TOKEN_TIMEOUT is how much a token will remain valid, default is 24h, you can change it to minutes (e.g. "15m") or to seconds (e.g. "30s")
- For the database connection we will leverage docker networks

## Running the stack

Now that everything is ready you may open a terminal and navigate to the root folder of the project and launch:

```sh
docker compose up -d
```

If everything went well you should see something similar to this:

```sh
[+] Running 5/5
 ✔ Network e-recycler_e-recycler-net  Created                                                                                                                                                                0.2s
 ✔ Container e-recycler-db-auth-1     Started                                                                                                                                                                1.2s
 ✔ Container e-recycler-db-app-1      Started                                                                                                                                                                1.2s
 ✔ Container auth_api                 Started                                                                                                                                                                1.5s
 ✔ Container e_recycler_api           Started                                                                                                                                                                1.6s
```

Congratulations! You are now ready to use e-recycler API!

You may now start making calls to: `http://localhost:E_RECYCLER_PORT` where E_RECYCLER_PORT has been set in the .env file.


See the full reference [here]("./reference.md").

## Uninstalling

Open a terminal and navigate to the project root folder, then execute:

```sh
docker compose down
```

The images will still be there so you can remove them with:
WARNING: this removes EVERY unused image, not only the e-recycler ones.

```sh
docker images prune --all
```
