package com.mindhub.homebanking.utils;

public class Utils {

    public static int getRandomNumber(int min, int max) {
        return (int) ((Math.random() * (max - min)) + min);
    }

    public static long getCardRandomNumber(long min, long max) {
        return (long) ((Math.random() * (max - min)) + min);
    }


}
