package com.mindhub.homebanking.services;

import com.mindhub.homebanking.models.Card;
import org.springframework.stereotype.Service;


public interface CardService {

    void saveCard(Card card);

    boolean deleteCard(Card card);

    Card findCard(Long number);

}


