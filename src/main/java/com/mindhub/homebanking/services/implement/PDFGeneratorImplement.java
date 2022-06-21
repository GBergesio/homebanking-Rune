package com.mindhub.homebanking.services.implement;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.mindhub.homebanking.dtos.PDFParamsDTO;
import com.mindhub.homebanking.models.Account;
import com.mindhub.homebanking.models.Client;

import com.mindhub.homebanking.models.Transaction;
import com.mindhub.homebanking.services.AccountService;
import com.mindhub.homebanking.services.ClientService;
import com.mindhub.homebanking.services.PDFService;
import com.mindhub.homebanking.services.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.io.IOException;

import java.time.LocalDateTime;
import java.time.Period;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static java.time.format.DateTimeFormatter.ISO_LOCAL_DATE;
import static java.time.format.DateTimeFormatter.ISO_LOCAL_DATE_TIME;

@Service
public class PDFGeneratorImplement implements PDFService {

    @Autowired
    ClientService clientService;

    @Autowired
    AccountService accountService;

    @Autowired
    TransactionService transactionService;


    @Override
    public void PDFGenerator(HttpServletResponse response, Authentication authentication, PDFParamsDTO pdfParamsDTO) throws IOException, DocumentException {

        Client client = clientService.getClientCurrent(authentication);

        Set<Transaction> transactions = transactionService.getTransactionsByAccount(pdfParamsDTO.getNumberAccount());

        Set<Transaction> setTransactionFilter = transactions.stream().filter(transaction -> transaction.getTransactionDate().isAfter(pdfParamsDTO.getDataSince()) && transaction.getTransactionDate().isBefore(pdfParamsDTO.getDateUntil())).collect(Collectors.toSet());

        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document,response.getOutputStream());

        //// inicia el documento//
        document.open();
        // Titulo
//        Image imageLogo = Image.getInstance("https://i.ibb.co/XWYGVZX/LogoPDF2.png");
////        imageLogo.setWidthPercentage(15f);
//        imageLogo.setAlignment(Element.ALIGN_CENTER);
////        imageLogo.setTransparency(new int[] { 0x50, 0x15 });
//        imageLogo.setAbsolutePosition(0,0);


//        // Creating a Document object
//        ImageData imageData = ImageDataFactory.create(
//                currDir + "/image.jpg");
//
//        // Creating imagedata from image on disk(from given
//        // path) using ImageData object
//        Image img = new Image(imageData);
//
//        // Creating Image object from the imagedata
//        doc.add(img);


        Font fontTitle = FontFactory.getFont(FontFactory.TIMES_BOLD);
        fontTitle.setSize(33);
        fontTitle.setColor(new Color(95, 10, 151));
        Paragraph title = new Paragraph("Rune Bank",fontTitle);
        title.setAlignment(Paragraph.ALIGN_RIGHT);

        Font fontClient = FontFactory.getFont(FontFactory.TIMES_BOLD);
        fontClient.setSize(20);
        Paragraph clientParagraph = new Paragraph("Client:" + client.getFullName(),fontClient);
        clientParagraph.setAlignment(Paragraph.ALIGN_LEFT);
        clientParagraph.setSpacingAfter(3);

        Font fontSubtitle = FontFactory.getFont(FontFactory.TIMES_BOLD);
        fontSubtitle.setSize(20);
        Paragraph subtitle = new Paragraph("List of transactions in Account ",fontSubtitle);
        subtitle.setAlignment(Paragraph.ALIGN_CENTER);
        subtitle.setSpacingAfter(8);

        // Creating a table
        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);

        java.util.List<String> lista = List.of("Date","Account","Description","Type","Amount","Balance");

        lista.forEach(element -> {
            PdfPCell c1 = new PdfPCell(new Phrase(element));
            c1.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(c1);
        });
        Comparator<Transaction> idComparator = Comparator.comparing(Transaction::getId);

        setTransactionFilter.stream().sorted(idComparator.reversed()).forEach(transaction -> {
            table.addCell(transaction.getTransactionDate().format(ISO_LOCAL_DATE));
            table.addCell(transaction.getAccount().getNumber() +"");
            table.addCell(transaction.getDescription()+"");
            table.addCell(transaction.getType()+"");
            table.addCell(transaction.getAmount()+"");
            table.addCell(transaction.getNewBalance()+"");
        });
//        document.add(imageLogo);
        document.add(title);
        document.add(clientParagraph);
        document.add(subtitle);
        document.add(table);

        //// finaliza el documento//
        document.close();
    }
}