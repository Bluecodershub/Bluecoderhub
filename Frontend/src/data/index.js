/**
 * Barrel export for data files.
 * Provides a single import path for all static data.
 *
 * Usage:
 *   import { products, jobs } from './data';
 */

import products from './products.json';
import jobs from './jobs.json';
import blog from './blog.json';
import services from './services.json';

export const data = {
    products,
    jobs,
    blog,
    services,
};

export { products, jobs, blog, services };