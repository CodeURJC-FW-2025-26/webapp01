# Videogames Store
# Web Name: GUEIM 

## Team Members

-   **Daniel Bonachela Martínez** – [d.bonachela.2022@alumnos.urjc.es](mailto:d.bonachela.2022@alumnos.urjc.es) – [GitHub Profile](https://github.com/fuihfuefuiewn)
-   **Marcelo Atanasio Domínguez Mateo** – [ma.dominguez.2022@alumnos.urjc.es](mailto:ma.dominguez.2022@alumnos.urjc.es) – [GitHub Profile](https://github.com/sa4dus)
-   **Alejandro Garcia Prada** – [a.garciap.2022@alumnos.urjc.es](mailto:a.garciap.2022@alumnos.urjc.es) – [GitHub Profile](https://github.com/AlexGarciaPrada)
### [Daniel Bonachela Martínez]
He hecho section de la página principal, encontrado y colocado las fotos y resuelto los detalles sueltos en form.html y en detail.html 
Commits principales:
- [grid restored](https://github.com/CodeURJC-FW-2025-26/webapp01/commit/bbf10a57991b5e1dd8b0bb4e04417413e844b29c)
- [Restored](https://github.com/CodeURJC-FW-2025-26/webapp01/commit/3261865dba38872cf3962ac6aacb7869a52fed2f)
- [Routes](https://github.com/CodeURJC-FW-2025-26/webapp01/commit/d60dfee13398eb2004280f603d4337832fd78748)
- [Add page layouts using bootstrap grid system](https://github.com/CodeURJC-FW-2025-26/webapp01/commit/94cd7e63484ae796cde7ac7cf783c41c0e22340a)
- [Details](https://github.com/CodeURJC-FW-2025-26/webapp01/commit/91f50ea4283619c4b9b23c7bf99a866ad20aabcf)

Archivos modificados:
- [index.html](src/pages/index.html)
- [detail.html](src/pages/index.html)
- [form.html](src/pages/form.html)


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
# Captures of the website
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