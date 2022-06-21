package com.mindhub.homebanking.controllers;
import com.mindhub.homebanking.dtos.CardDTO;
import com.mindhub.homebanking.models.Card;
import com.mindhub.homebanking.models.Client;
import com.mindhub.homebanking.models.CardColor;
import com.mindhub.homebanking.models.CardType;
import com.mindhub.homebanking.services.CardService;
import com.mindhub.homebanking.services.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import static com.mindhub.homebanking.utils.Utils.getCardRandomNumber;
import static com.mindhub.homebanking.utils.Utils.getRandomNumber;

@RequestMapping("/api")
@RestController
public class CardController {

//    @Autowired
//    private CardRepository cardRepository;
//    @Autowired
//    private ClientRepository clientRepository;
    @Autowired
    private CardService cardService;
    @Autowired
    private ClientService clientService;

    @PostMapping("/clients/current/cards")

    public ResponseEntity<Object> createCard(Authentication authentication,
                                             @RequestParam CardType cardType, @RequestParam CardColor cardColor) {

        Client client = clientService.getClientCurrent(authentication);

        List <Card> listCardsDebit = client.getCards().stream().filter(cardEnabled -> cardEnabled.getEnabled() == true).filter(card -> card.getType().equals(CardType.DEBIT)).collect(Collectors.toList());
        List <Card> listCardsCredit = client.getCards().stream().filter(cardEnabled -> cardEnabled.getEnabled() == true).filter(card -> card.getType().equals(CardType.CREDIT)).collect(Collectors.toList());

        if(listCardsDebit.size() >= 3 && cardType == CardType.DEBIT){
            return new ResponseEntity<>("Forbidden, already has 3 Debit Cards", HttpStatus.FORBIDDEN);
        }
        if(listCardsCredit.size() >= 3 && cardType == CardType.CREDIT){
            return new ResponseEntity<>("Forbidden, already has 3 Credit Cards", HttpStatus.FORBIDDEN);
        }
//        cardRepository.save(new Card(cardType, cardColor,Long.valueOf(4509L + "" + getCardRandomNumber(1000L,9999L) + "" +  getCardRandomNumber(1000L,9999L) + "" + getCardRandomNumber(1000L,9999L)).longValue(), getRandomNumber(100,999), LocalDateTime.now().plusYears(5), LocalDateTime.now(), client, true ));
        cardService.saveCard(new Card(cardType, cardColor,Long.valueOf(4509L + "" + getCardRandomNumber(1000L,9999L) + "" +  getCardRandomNumber(1000L,9999L) + "" + getCardRandomNumber(1000L,9999L)).longValue(), getRandomNumber(100,999), LocalDateTime.now().plusYears(5), LocalDateTime.now(), client, true));
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/clients/current/cards")
    public Set<CardDTO> getCardDTO(Authentication authentication){

        Client client = clientService.getClientCurrent(authentication);
        return client.getCards().stream().filter(card -> card.getEnabled() == true).map(cardDTO -> new CardDTO(cardDTO)).collect(Collectors.toSet());
    }

    @GetMapping("/clients/current/cards/{id}")
    public Set<Card> deleteCards(Authentication authentication, @PathVariable Long id){
        Client client = clientService.getClientCurrent(authentication);
        return client.getCards().stream().filter(card -> card.getId() != id).collect(Collectors.toSet());
    }
    @PostMapping("/cards/delete")
    public ResponseEntity<String> cardDelete(Authentication authentication,@RequestParam Long cardNumber){
        Client client = clientService.getClientCurrent(authentication);
        Card card = cardService.findCard(cardNumber);
//                cardRepository.findByNumber(cardNumber);

        if(card == null){
            return new ResponseEntity<>("Card does not exist", HttpStatus.FORBIDDEN);
        }
        if(!client.getCards().contains(card)){
            return new ResponseEntity<>("Card does not belong to authenticated client", HttpStatus.FORBIDDEN);
        }
        if(cardService.deleteCard(card)){
            return new ResponseEntity<>("Card deleted successfully", HttpStatus.ACCEPTED);
        }
        return new ResponseEntity<>("Error", HttpStatus.BAD_REQUEST);
    }
}