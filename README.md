## Goals

### Create a Production grade E-Comm Ticket Management application using a Micro-service Architecture

##### Utilize Technologies such as: Typescript(strongly typed, static lang), NodeJS (runtime environment), ExpressJS(framework for Node), Docker(manage images, containers), Kubernetes(cluster and manage multiple services, deployments and pods), Ingress-Nginx(route our request to specific services), Skaffold(runs kubectl apply -f on file mondification), Mongoose (mongoose model used to get specific data from mongoDB), MongoDB(noSQL db), Redis(in-memory no sql db cache), JSON Web Tokens(auth), cookies(auth) Jest(testing framework), SuperTest(testrunner), ReactJS(clientside framework), NextJS(ServerSideRendering), NATS Streaming Server, Stripe(payments), Service workers, git(version control), Google Cloud Build(deploy to cloud)

###### 1. Users can list a ticket for an event e.g sports as for sale

###### 2. Other users can purchase this ticket

###### 3. Any user can list tickets for sale and purchase tickets

###### 4. when a user attempts to purchase a ticket the ticket will be locked for a certain time period in which the user has to enter their payment information

###### 6. While the ticket is locked no other user can purchase the ticket and after the time period expiry the ticket needs to be unlocked

###### 7. Ticket prices can be edited if they are not locked
