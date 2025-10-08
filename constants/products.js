// Date options
const options = {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric"
};

// Server Database
const products = [
    // Quelle: https://world.openfoodfacts.org/product/4105250022003/augustinerbrau-lagerbier-hell-augustinerbrau-munchen
    {
        id: 1,
        pictureListURL: "/images/augustiner_list.jpg",
        pictureSingleURL: "/images/augustiner_single.jpg",
        pictureBarcodeURL: "/images/augustiner_barcode.png",
        name: "Augustinerbräu Lagerbier Hell",
        ean: 4105250022003,
        bestBefore: new Date(2022, 11, 15).toLocaleDateString("de-DE", options),
        daysBeforeExpiry: Math.round(((new Date(2022, 11, 15).getTime() - Date.now()) / 1000 / 3600 / 24) + 1),
        quantity: 6,
        ingredients: "Wasser, Gerstenmalz, Hopfen",
        nutrients: {
            energyValue: "160 kj (38 kcal)",
            carbohydrates: "?",
            sugar: "?",
            fat: "?",
            protein: "?",
            salt: "?"
        }
    },
    // Quelle: https://world.openfoodfacts.org/product/4058172241567/studenten-futter-dm-bio
    {
        id: 2,
        pictureListURL: "/images/studentenfutter_list.jpg",
        pictureSingleURL: "/images/studentenfutter_single.jpg",
        pictureBarcodeURL: "/images/studentenfutter_barcode.png",
        name: "Studenten Futter",
        ean: 4058172241567,
        bestBefore: new Date(2022, 6, 11).toLocaleDateString("de-DE", options),
        daysBeforeExpiry: Math.round(((new Date(2022, 6, 11).getTime() - Date.now()) / 1000 / 3600 / 24) + 1),
        quantity: 2,
        ingredients: "NUSSKERNMISCHUNG (in veränderlichen Gewichtsanteilen: CASHEWKERNE, MANDELN geschält, HASELNUSSKERNE, WALNUSSKERNE ), 25% Weinbeeren getrocknet, geölt (Weinbeeren, Sonnenblumenöl)",
        nutrients: {
            energyValue: "1,959 kj (470 kcal)",
            carbohydrates: "41 g",
            sugar: "37 g",
            fat: "28 g",
            protein: "10 g",
            salt: "0.03 g"
        }
    },
    // Quelle: https://world.openfoodfacts.org/product/4260414150531/vier-kase-fur-ein-halleluja-gustavo-gusto
    {
        id: 3,
        pictureListURL: "/images/pizza_list.jpg",
        pictureSingleURL: "/images/pizza_single.jpg",
        pictureBarcodeURL: "/images/pizza_barcode.png",
        name: "Vier Käse für ein Halleluja",
        ean: 4260414150531,
        bestBefore: new Date(2022, 11, 4).toLocaleDateString("de-DE", options),
        daysBeforeExpiry: Math.round(((new Date(2022, 3, 14).getTime() - Date.now()) / 1000 / 3600 / 24) + 1),
        quantity: 1,
        ingredients: "49% Teig (Weizenmehl, Wasser, Olivenöl, Salz, Frischbackhefe), 23% Tomatensoße (Schältomaten, Salz, Olivenöl, Gewürze), 13% schnittfester Mozzarella (pasteurisierte Kuhmilch, Salz, mikrobieller Labaustauschstoff, Milchsäurebakterienkulturen), 7% Blauschimmelkäse, 5% Cheddar, 3% Bergkäse",
        nutrients: {
            energyValue: "996 kj (238 kcal)",
            carbohydrates: "27 g",
            sugar: "5 g",
            fat: "9.4 g",
            protein: "11 g",
            salt: "1.5 g"
        }
    },
    // Quelle: https://world.openfoodfacts.org/product/4008167042877/dallmayr-crema-d-oro-intensa
    {
        id: 4,
        pictureListURL: "/images/kaffeepads_list.jpg",
        pictureSingleURL: "/images/kaffeepads_single.jpg",
        pictureBarcodeURL: "/images/kaffeepads_barcode.png",
        name: "Dallmayr Crema d'Oro Intensa",
        ean: 4008167042877,
        bestBefore: new Date(2025, 7, 5).toLocaleDateString("de-DE", options),
        daysBeforeExpiry: Math.round(((new Date(2025, 7, 5).getTime() - Date.now()) / 1000 / 3600 / 24) + 1),
        quantity: 3,
        ingredients: "Dallmayr Kaffee gemahlen, in Kaffeepads",
        nutrients: {
            energyValue: "?",
            carbohydrates: "?",
            sugar: "?",
            fat: "?",
            protein: "?",
            salt: "?"
        }
    }
]

module.exports = products;