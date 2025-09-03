### Musicmeta - Solo project
This is a web-based application designed to interact with music metadata. It provides users with a user-friendly interface to search, view, and manage information about artists, albums and tracks. The project emphasizes responsive design and modularity thanks to React. 
For a in-depth overview/explanation and screenshots, have a look at this [file](https://github.com/Pyrrhusn/musicmeta-backend/blob/main/dossier.pdf).

#### Technologies Used (not exhaustive)

- **JavaScript** – The core programming language for application logic and interactivity.
- **React** – For building a dynamic and responsive user interface.
- **React Hooks** – Utilized extensively for managing state (`useState`), side effects (`useEffect`), performance optimizations (`useMemo`, `useCallback`), and code modularity.
- **RESTful API** – Communication with backend services to fetch and manage music metadata.
- **Chakra UI** - UI component library, used for the layouts, themes and UI elements.
- **Axios + SWR hook** – For making HTTP requests backend api and manage data.

#### Dependencies
Following software is required to run this project:
- [NodeJS](https://nodejs.org)
- [Yarn](https://yarnpkg.com)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)
- Dependencies in [package.json](package.json)

#### Startup
1. Create a `.env` file in the root containing:

```bash
VITE_API_URL='' #enter the url on which the REST api is running
```

2. Open a terminal and run `npm run dev`.

3. The url and port on which the frontend is available will be visible in the terminal.
