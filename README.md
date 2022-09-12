## Backend architecture: MVC

Model: Classes that are responsible for communicating with the different DBs (Firebase Firestore - Algolia - Airtable). Each Model/Class represents a database record. Moreover, each Class has its own methods to communicate with the database.

View: This section controls the request (req) and response (res) of the endpoint. Thus, if the request is correct, the View invokes the necessary Controllers.

Controller: Controllers are in charge of the business logic of the application, using the methods of the Model. Therefore, Controllers invoke the necessary Models to achieve the mentioned goal.

![MVC](https://user-images.githubusercontent.com/84744435/188996667-33991f4f-2893-42bf-90a0-352f4bcbb0b3.png)

<br/>


## Postman Documentation
https://documenter.getpostman.com/view/17990146/VUjLKRpq

<br/>


## Tech Stack & Concepts applied: 

- Node
- Next
- TypeScript
- Firebase
- Algolia
- Airtable
- Gateway (MP)
- Passwordless
- Serverless Functions
- OOP
- MVC
- API REST
- Pagination
- JWT
- Yup
- ESlint
