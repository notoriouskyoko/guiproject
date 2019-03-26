module.exports = [
    {
        method: "GET",
        path: "/js/{param*}",
        config: {
            auth: { mode: 'try' },
            handler: {
                directory: {
                    path: "./js",
                    listing: false,
                    index: false,
                },
            },
        },
    },
    {
        method: "GET",
        path: "/img/{param*}",
        config: {
            auth: { mode: 'try' },
            handler: {
                directory: {
                    path: "./img",
                    listing: false,
                    index: false,
                },
            },
        },
    },
    {
        method: "GET",
        path: "/css/{param*}",
        config: {
            auth: { mode: 'try' },
            handler: {
                directory: {
                    path: "./css",
                    listing: false,
                    index: false,
                },
            },
        },
    },
]