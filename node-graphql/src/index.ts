import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schema';
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import swaggerUi from 'swagger-ui-express';

export const buildApp = async () => {
    const app = express();
    app.use(cors());
    app.use(express.json());

    const specPath = path.join(process.cwd(), 'openapi.yaml');
    const openapiDoc = YAML.parse(fs.readFileSync(specPath, 'utf8'));
    app.use(
        '/docs',
        swaggerUi.serve,
        swaggerUi.setup(openapiDoc, {
            customCss: '.swagger-ui .topbar { display: none }',
            customSiteTitle: 'EnergeX Assessment API Docs',
        })
    );

    const apollo = new ApolloServer({ typeDefs, resolvers });
    await apollo.start();
    app.use('/graphql', expressMiddleware(apollo));

    return app;
};

// If not in test mode, start server
if (process.env.NODE_ENV !== 'test') {
    (async () => {
        const app = await buildApp();
        const PORT = Number(process.env.PORT || 4000);
        app.listen(PORT, () => {
            console.log(`Swagger UI at http://127.0.0.1:${PORT}/docs`);
            console.log(`GraphQL at http://127.0.0.1:${PORT}/graphql`);
        });
    })();
}