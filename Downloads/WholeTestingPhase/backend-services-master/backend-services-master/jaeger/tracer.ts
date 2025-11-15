import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeSDK } from '@opentelemetry/sdk-node';
import * as process from 'process';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { AmqplibInstrumentation } from '@opentelemetry/instrumentation-amqplib';
import { Resource } from '@opentelemetry/sdk-metrics/node_modules/@opentelemetry/resources/build/src/Resource';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
const jaegerExporter = new JaegerExporter({ endpoint: 'https://10.152.2.122:14268/api/traces' });
const spanProcessor = new BatchSpanProcessor(jaegerExporter);
let otelSDK;

export function startTracing(serviceName: string) {
    otelSDK = new NodeSDK({
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: serviceName, // update this to a more relevant name for you!
        }),
        spanProcessor: spanProcessor, //new SimpleSpanProcessor(jaegerExporter),

        instrumentations: [
            new AmqplibInstrumentation(),
            new HttpInstrumentation(),
            new NestInstrumentation(),
        ],
    });
    otelSDK.start();

    // Gracefully shut down the SDK on process exit
    process.on('SIGTERM', async () => {
        try {
            await otelSDK.shutdown();
            console.log('SDK shut down successfully');
        } catch (err) {
            console.log('Error shutting down SDK', err);
        } finally {
            process.exit(0);
        }
    });
}
