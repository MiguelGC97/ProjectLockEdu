module.exports = {
    testEnvironment: "jsdom",
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Ignora archivos de estilos
    },
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"], // Archivo de configuración global
};