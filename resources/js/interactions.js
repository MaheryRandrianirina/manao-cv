import InteractionsWithCVModels from "./utils/interactions-with-cv-models";
import InteractionsWithNavbar from "./utils/interactions-with-navbar";

export default class Interactions {
    constructor(){
        this.withNavbar();
        this.withCVModels();
    }

    withNavbar()
    {
        InteractionsWithNavbar();
    }

    withCVModels()
    {
        InteractionsWithCVModels();
    }
}