package com.mindhub.homebanking.services;

import com.mindhub.homebanking.dtos.ClientDTO;
import com.mindhub.homebanking.models.Client;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;


public interface ClientService {

    List<ClientDTO> getListClientsDTO();
    Client getClientCurrent(Authentication authentication);
    ClientDTO getClientDTO(long id);
    void saveClient(Client client);
    Client getClientByEmail(String email);

}
