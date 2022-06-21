package com.mindhub.homebanking.services;
import com.lowagie.text.DocumentException;
import com.mindhub.homebanking.dtos.PDFParamsDTO;
import com.mindhub.homebanking.models.Client;
import org.springframework.security.core.Authentication;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;


public interface PDFService {

    void PDFGenerator(HttpServletResponse response, Authentication authentication, PDFParamsDTO pdfParamsDTO) throws IOException, DocumentException;

}
