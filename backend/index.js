const express = require('express');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const graphQlSchema = require('./src/graphql/schema/index');
const graphQlResolvers = require('./src/graphql/resolvers/index');
const isAuth = require('./src/middleware/is-auth');

const ENVIRONMENT = 'DEV'
const PORT = process.env[`${ENVIRONMENT}_PORT`];
const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});
app.use(isAuth);

// graphql middleware
app.use('/graphql', graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env[`${ENVIRONMENT}_MONGO_USER`]}:${process.env[`${ENVIRONMENT}_MONGO_PASSWORD`]}@freetestcluster.ykj71.mongodb.net/${process.env[`${ENVIRONMENT}_MONGO_DB`]}?retryWrites=true&w=majority`)

app.listen(PORT, () => {
    console.log(`Application started on port ${PORT}`);
});
