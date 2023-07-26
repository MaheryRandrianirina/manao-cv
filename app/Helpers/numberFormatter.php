<?php

namespace App\Helpers;

class NumberFormatter 
{
    public static function phone(string $value): string {
        $number = "";
        $arrayValue = str_split($value);
        
        for($i = 0; $i < count($arrayValue); $i++){
           
            $number .= $arrayValue[$i];
            if($i === 2 || $i === 4
                || $i === 7
            ){
                $number .= " ";
            }
        }

        return $number;
    }
}