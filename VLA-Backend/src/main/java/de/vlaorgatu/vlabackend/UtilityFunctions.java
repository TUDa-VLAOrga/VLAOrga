package de.vlaorgatu.vlabackend;

/**
 * Class for frequently reusable functions.
 */
public class UtilityFunctions {

    /**
     * String containing all hex characters of the hexadecimal number system.
     */
    final static String validHexChars = "0123456789ABCDEFabcdef";

    /**
     * Checks if a string matches the standard html color notation.
     * E.g. #FF0000 for red
     * @param colorString The string to check
     * @return True iff. string matches pattern #RRGGBB
     */
    public static boolean checkColorFormatHtml7CharsNotation(String colorString){
        if(colorString.length() != 7) return false;
        if(colorString.charAt(0) != '#') return false;

        for(int i = 1; i < 7; i++){
            // Check if each char corresponds to a valid hex char
            if(validHexChars.indexOf(colorString.charAt(i)) == -1)
                return false;
        }

        return true;
    }
}
