# Videogames Store
# Web Name: GUEIM 

## Team Members

-   **Daniel Bonachela Martínez** – [d.bonachela.2022@alumnos.urjc.es](mailto:d.bonachela.2022@alumnos.urjc.es) – [GitHub Profile](https://github.com/fuihfuefuiewn)
-   **Marcelo Atanasio Domínguez Mateo** – [ma.dominguez.2022@alumnos.urjc.es](mailto:ma.dominguez.2022@alumnos.urjc.es) – [GitHub Profile](https://github.com/sa4dus)
-   **Alejandro Garcia Prada** – [a.garciap.2022@alumnos.urjc.es](mailto:a.garciap.2022@alumnos.urjc.es) – [GitHub Profile](https://github.com/AlexGarciaPrada)

## Functionality

### Entities

#### Main Entity

-   **Entity Name**: Videogame
-   **Description**: Represents each game listed in the platform
-   **Attributes**:
    -   `title`
    -   `description`
    -   `genre`
    -   `platform`
    -   `release_year`
    -   `developer`
    -   `cover_image`
    -   `pegi_rating`
    -   `average_rating`: from 0 to 100

#### Secondary Entity

-   **Entity Name**: Review
-   **Description**: Represents user's rating and written opinion about a videogame.
-   **Attributes**:
    -   `author`      
    -   `rating`
    -   `comment`
    -   `created_at`

### Images

-   **Main Entity**: Videogames will have an associated `cover_image`.

### Search and Filtering
-   **Search**: Users can search Videogames by name.
-   **Filtering**: The application allows filtering Videogames based on `genre`, `platform`, `release_year`, `developer`, `pegi_rating` and `average_rating` (within an interval).

# Práctica 1
## Captures of the website
![main_page_capture](img/main_page_capture.png)
*main page capture*
![detail_page_capture_1](img/detail_page_capture_1.png)
*detail page capture 1*
![detail_page_capture_2](img/detail_page_capture_2.png)
*detail page capture 2*
![detail_page_capture_3](img/detail_page_capture_3.png)
*detail page capture 3*
![form_page_capture_1](img/form_page_capture_1.png)
*form page capture 1*
![form_page_capture_2](img/form_page_capture_2.png)
*form page capture 2*
---
## Member participation

### Marcelo Atanasio Domínguez Mateo

I implemented the display of the main entity data, the filter sidebar, and the footer, along with some style adjustments.

**Main commits:**

-   [Set details page layout](https://github.com/CodeURJC-FW-2025-26/webapp01/commit/16104a6)
-   [First version of sidebar](https://github.com/CodeURJC-FW-2025-26/webapp01/commit/7cd538d)
-   [Prior version of footer](https://github.com/CodeURJC-FW-2025-26/webapp01/commit/bea8db7)
-   [Add footer to detail and form pages](https://github.com/CodeURJC-FW-2025-26/webapp01/commit/2453d01)
-   [Add page layouts using bootstrap grid system](https://github.com/CodeURJC-FW-2025-26/webapp01/commit/94cd7e6)

**Modified files:**

-   `src/pages/detail.html`
-   `src/css/style.css`
-   `src/pages/form.html`
-   `src/pages/index.html`
### Alejandro García Prada

I implemented the forms for adding video games (main entity) and reviews (secundary entity), along with the header and reviews display.

**Main commits:**

-   [Form for new reviews added](https://github.com/CodeURJC-FW-2025-26/webapp01/commit/36cdd0f)
-   [Creation of form.html](https://github.com/CodeURJC-FW-2025-26/webapp01/commit/e8703da)
-   [Reviews added to detail page](https://github.com/CodeURJC-FW-2025-26/webapp01/commit/7781357)
-   [Nav bar addded to the pages](https://github.com/CodeURJC-FW-2025-26/webapp01/commit/e821bf2)
-   [navs added](https://github.com/CodeURJC-FW-2025-26/webapp01/commit/8bf5a5c)

**Modified files:**

-   `src/pages/form.html`
-   `src/pages/index.html`
-   `src/pages/detail.html`
  
### Daniel Bonachela Martínez

I created the main page section, found and added the images, and fixed minor issues in form.html and detail.html.

**Main commits:**
- [grid restored](https://github.com/CodeURJC-FW-2025-26/webapp01/commit/bbf10a5)
- [Restored](https://github.com/CodeURJC-FW-2025-26/webapp01/commit/3261865)
- [Routes](https://github.com/CodeURJC-FW-2025-26/webapp01/commit/d60dfee)
- [Add page layouts using bootstrap grid system](https://github.com/CodeURJC-FW-2025-26/webapp01/commit/94cd7e6)
- [Details](https://github.com/CodeURJC-FW-2025-26/webapp01/commit/91f50ea)

**Modified files:**

-   `src/pages/form.html`
-   `src/pages/index.html`
-   `src/pages/detail.html`
