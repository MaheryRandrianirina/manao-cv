<?php
namespace App\Helpers;

use DateTime;

class Date {

    const MONTHS = [
        1 => "Janvier",
        2 => "Fevrier",
        3 => "Mars",
        4 => "Avril",
        5 => "Mai",
        6 => "Juin",
        7 => "Juillet",
        8 => "Août",
        9 => "Septembre",
        10 => "Octobre",
        11 => "Novembre", 
        12 => "Décembre"
    ];

    public static function getLitteralMonth(DateTime $date): string
    {
        return self::MONTHS[(int) $date->format("m")];
    }
}