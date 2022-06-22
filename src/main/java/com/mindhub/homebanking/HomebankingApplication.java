
package com.mindhub.homebanking;

import com.mindhub.homebanking.models.*;
import com.mindhub.homebanking.repositories.*;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.redis.RedisProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class HomebankingApplication {

	@Autowired
	private PasswordEncoder passwordEncoder;

	public HomebankingApplication() {
	}

	public static void main(String[] args) {
		SpringApplication.run(HomebankingApplication.class, args);
	}



	@Bean
	public CommandLineRunner initData(ClientRepository repositoryClient, AccountRepository repositoryAccount, TransactionRepository repositoryTransaction, LoanRepository loanRepository, ClientLoanRepository clientLoanRepository, CardRepository cardRepository) {
		return (args) -> {
			Client clientOne = new Client("Melba", "Morel", "melba@mindhub.com", passwordEncoder.encode("melba123"), UserType.CLIENT);
			Client clientSecond = new Client("Guillermo", "Bergesio", "gbergesio@gmail.com", passwordEncoder.encode("cuscus123"), UserType.CLIENT);
			Client admin = new Client("Cuscus","Bergesio","cus@runebank.com",passwordEncoder.encode("cuscus123"), UserType.ADMIN);

			Account accountOne = new Account("VIN-00000001", LocalDateTime.now(), 5000.0,AccountType.SAVINGS, clientOne,true);
			Account accountSecond = new Account("VIN-00000002", LocalDateTime.now().plusDays(1), 7500.0,AccountType.CURRENT, clientOne,true);
			Account accountThird = new Account("VIN-00000003", LocalDateTime.now(), 2990.0,AccountType.SAVINGS, clientSecond,true);
			Account accountCuatro = new Account("VIN-00000004", LocalDateTime.now().plusDays(1), 7100.0,AccountType.SAVINGS ,clientOne,true);
			Account accountAdmin = new Account("VIN-00000077", LocalDateTime.now().plusDays(1), 99900.0,AccountType.CURRENT ,admin,true);

			Transaction transactionOneCredit = new Transaction(TransactionType.CREDIT,3500,"Month of Work at Google",LocalDateTime.now().minusDays(3),accountOne, accountOne.getBalance());
			Transaction transactionSecondCredit = new Transaction(TransactionType.CREDIT,1200,"Third party transfer",LocalDateTime.now(),accountOne, accountOne.getBalance());

			Transaction transactionOneDebit = new Transaction(TransactionType.DEBIT,900,"Rental - Miami Apartments",LocalDateTime.now().minusDays(4),accountOne, accountOne.getBalance());
			Transaction transactionSecondDebit = new Transaction(TransactionType.DEBIT,250,"Hertz Car Rental - 7 Days Tesla Model S",LocalDateTime.now().minusDays(7),accountOne, accountOne.getBalance());
			Transaction transactionThirdDebit = new Transaction(TransactionType.DEBIT,35,"Starbuks Cofee",LocalDateTime.now().minusDays(9),accountOne, accountOne.getBalance());

			Loan loanOne = new Loan("Mortgage Loan", 500000d,15d ,List.of(12,24,36,48,60));
			Loan loanSecond = new Loan("Personal Loan", 100000d,12d,List.of(6,12,24));
			Loan loanThird = new Loan("Car Loan", 300000d,17d,List.of(6,12,24,36));

			Card cardOne = new Card(CardType.DEBIT, CardColor.GOLD,4509243231123412L,133, LocalDateTime.now().plusDays(55),LocalDateTime.now(),clientOne,true);
			Card cardSecond = new Card(CardType.CREDIT, CardColor.BLACK,4509242231377912L,233, LocalDateTime.now().minusMonths(4),LocalDateTime.now(),clientOne,true);
			Card cardFourth = new Card(CardType.CREDIT, CardColor.PLATINUM,4509243331371932L,993, LocalDateTime.now().plusMonths(4),LocalDateTime.now(),clientOne,true);
			Card cardThird = new Card(CardType.CREDIT, CardColor.PLATINUM,4509212231267945L,113, LocalDateTime.now().plusYears(5),LocalDateTime.now(),clientSecond,true);

			repositoryClient.save(clientOne);
			repositoryClient.save(clientSecond);
			repositoryClient.save(admin);

			repositoryAccount.save(accountOne);
			repositoryAccount.save(accountSecond);
			repositoryAccount.save(accountThird);
			repositoryAccount.save(accountCuatro);
			repositoryAccount.save(accountAdmin);

			repositoryTransaction.save(transactionOneCredit);
			repositoryTransaction.save(transactionSecondCredit);
			repositoryTransaction.save(transactionOneDebit);
			repositoryTransaction.save(transactionSecondDebit);
			repositoryTransaction.save(transactionThirdDebit);

			loanRepository.save(loanOne);
			loanRepository.save(loanSecond);
			loanRepository.save(loanThird);

			cardRepository.save(cardOne);
			cardRepository.save(cardSecond);
			cardRepository.save(cardThird);
			cardRepository.save(cardFourth);
		};
	}
}