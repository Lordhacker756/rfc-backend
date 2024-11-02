import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'NFC Backend API Documentation',
            version: '1.0.0',
            description: 'API documentation for NFC-based digital business card management service',
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

export const swaggerDocs = (app) => {
    // Swagger page
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

    // Docs in JSON format
    app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(specs);
    });
}; 