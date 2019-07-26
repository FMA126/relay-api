RESTaurant-API is the backend for a restaurant inventory application that was designed and coded by Adam Caplan, Jeremy Denton, Merritt Blanks, and Oliver Sablove, as part of a project for General Assembly.

The app is designed to provide an easy way for restaurants to track their inventory.

## Relevant Links
- Backend deployed: https://secret-depths-15843.herokuapp.com/
- Frontend repo: https://github.com/FMA126/Relay
- Frontend deployed: https://fma126.github.io/Relay/

-ERD: https://imgur.com/cKsTx5Y

## Technologies Used:
- Express.js
- Node.js
- Mongoose
- MongoDB
- Puppeteer
- Cheerio

## Our Development Process
This app was developed in four days as a part of General Assembly's final project.  The app is backend heavy and the majority of time was spent developing that.

## Unsolved Problems / Future Directions
Future versions of this application could include:

- Improvements to the scrapper
- Additional resources

## API End Points

| Verb   | URI Pattern               | Routes#Action |
|--------|---------------------------|-------------------------|
| POST   | `/sign-up`                | `users#signup`          |
| POST   | `/sign-in`                | `users#signin`          |
| DELETE | `/sign-out`               | `users#signout`         |
| PATCH  | `/change-password`        | `users#changepassword`  |
| GET    | `/quotes`                 | `quotes#index`            |
| POST   | `/quotes`                 | `quotes#create`           |
| GET    | `/quotes/:id`             | `quotes#show`            |
| PATCH  | `/quotes/:id`             | `quotes#update`          |
| DELETE | `/quotes/:id`             | `quotes#destroy`         |

All data returned from API actions is formatted as JSON.

## User Actions

_Note_: Sending JSON data via curl scripts will require specifying the content-
type, however axios defaults to JSON.

*Summary:*

<table>
<tr>
  <th colspan="4">Request</th>
  <th colspan="2">Response</th>
</tr>
<tr>
  <th>Verb</th>
  <th>URI</th>
  <th>body</th>
  <th>Headers</th>
  <th>Status</th>
  <th>body</th>
</tr>
<tr>
<td>POST</td>
<td>`/sign-up`</td>
<td><strong>credentials</strong></td>
<td>empty</td>
<td>201, Created</td>
<td><strong>user</strong></td>
</tr>
<tr>
  <td colspan="4"></td>
  <td>400 Bad Request</td>
  <td><em>empty</em></td>
</tr>
<tr>
<td>POST</td>
<td>`/sign-in`</td>
<td><strong>credentials</strong></td>
<td>empty</td>
<td>200 OK</td>
<td><strong>user w/token</strong></td>
</tr>
<tr>
  <td colspan="4"></td>
  <td>401 Unauthorized</td>
  <td><em>empty</em></td>
</tr>
<tr>
<td>DELETE</td>
<td>`/sign-out`</td>
<td>empty</td>
<td><strong>token</strong></td>
<td>201 Created</td>
<td>empty</td>
</tr>
<tr>
  <td colspan="4"></td>
  <td>401 Unauthorized</td>
  <td><em>empty</em></td>
</tr>
<tr>
<td>PATCH</td>
<td>`/change-password`</td>
<td><strong>passwords</strong></td>
<td><strong>token</strong></td>
<td>204 No Content</td>
<td><strong>user w/token</strong></td>
</tr>
<tr>
  <td colspan="4"></td>
  <td>400 Bad Request</td>
  <td><em>empty</em></td>
</tr>
</table>

# Item Actions

All item action requests must include a valid HTTP header `Authorization: Bearer ${TOKEN}` or they will be rejected with a status of 401 Unauthorized.

All of the item actions follow the *RESTful* style.

*Summary:*

<table>
<tr>
  <th colspan="3">Request</th>
  <th colspan="2">Response</th>
</tr>
<tr>
  <th>Verb</th>
  <th>URI</th>
  <th>body</th>
  <th>Status</th>
  <th>body</th>
</tr>
<tr>
  <td colspan="3">
  The default is to retrieve all items associated with the user..
  </td>
  <td>401 Unauthorized</td>
  <td><em>empty</em></td>
</tr>
<tr>
<td>POST</td>
<td>`/quotes`</td>
<td>'{}'</td>
<td>201, Created</td>
<td><strong>item created</strong></td>
</tr>
<tr>
  <td colspan="3">
  </td>
  <td>401 Unauthorized</td>
  <td><em>empty</em></td>
</tr>
<tr>
  <td colspan="3">
  </td>
  <td>400 Bad Request</td>
  <td><strong>errors</strong></td>
</tr>
<tr>
<td>GET</td>
<td>`/quotes/:id`</td>
<td>n/a</td>
<td>200, OK</td>
<td><strong>item found</strong</td>
</tr>
<tr>
  <td colspan="3">
  </td>
  <td>401 Unauthorized</td>
  <td><em>empty</em></td>
</tr>
<tr>
  <td colspan="3">
  </td>
  <td>404 Not Found</td>
  <td><em>empty</em></td>
</tr>
<tr>
<td>PATCH</td>
<td>`/quotes/:id`</td>
<td><strong>item delta</strong></td>
<td>200, OK</td>
<td><strong>item updated</strong></td>
</tr>
<tr>
  <td colspan="3"></td>
  <td>400 Bad Request</td>
  <td><strong>errors</strong></td>
</tr>
<tr>
  <td colspan="3"></td>
  <td>404 Not Found</td>
  <td><em>empty</em></td>
</tr>
<tr>
<td>DELETE</td>
<td>`/quotes/:id`</td>
<td><strong>'{}'</strong></td>
<td>204, OK</td>
<td><strong>item updated</strong></td>
</tr>
<tr>
  <td colspan="3"></td>
  <td>400 Bad Request</td>
  <td><strong>errors</strong></td>
</tr>
<tr>
  <td colspan="3"></td>
  <td>404 Not Found</td>
  <td><em>empty</em></td>
</tr>
</table>
