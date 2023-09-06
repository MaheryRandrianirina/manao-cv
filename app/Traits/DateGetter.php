<?php
namespace App\Traits;

use App\Helpers\Date;
use DateTime;

trait DateGetter {

    public function getDateDebut(): string
    {
        $date = (new DateTime($this->date_debut));

        if(property_exists($this, "dateMustBeLitterals") && $this->dateMustBeLitterals){
            return Date::getLitteralMonth($date) . " " . $date->format('Y');
        }

        return $date->format($this->format);
    }

    public function getDateEnd(): string
    {
        $date = (new DateTime($this->date_end));

        if(property_exists($this, "dateMustBeLitterals") && $this->dateMustBeLitterals){
            return Date::getLitteralMonth($date) . " " . $date->format('Y');
        }

        return $date->format($this->format);
    }
}