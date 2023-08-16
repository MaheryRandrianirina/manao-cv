import InteractionsWithCVModels from "./utils/interactions-with-cv-models";
import InteractionsWithNavbar from "./utils/interactions-with-navbar";
import InteractionsWithSavings from "./utils/interactions-with-savings";

export default class Interactions {
    constructor(){
        this.withNavbar();

        this.withCVModels();

        // AVEC LES ENREGISTREMENTS 
        this.withSavings();
    }

    withNavbar()
    {
        InteractionsWithNavbar();
    }

    withCVModels()
    {
        InteractionsWithCVModels();
    }

    withSavings()
    {
        InteractionsWithSavings();
    }
}