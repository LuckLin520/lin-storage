import { terser } from "rollup-plugin-terser"
export default {
    input: 'main.js',
    output: {
        file: 'index.js',
        format: 'esm'
    },
    plugins: [
        terser()
    ]
}