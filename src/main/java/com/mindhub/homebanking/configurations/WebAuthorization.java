package com.mindhub.homebanking.configurations;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@EnableWebSecurity
@Configuration
public class WebAuthorization extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http.authorizeRequests()

                .antMatchers("/web/index.html","/web/login.html","/web/data/index.js","/web/data/login.js").permitAll()

                .antMatchers(HttpMethod.POST,"/api/transactions/posnet").permitAll()

                .antMatchers("/web/styles/**","/web/img/**","/web/vendor/**").permitAll()

                .antMatchers("/web/accounts.html","/web/account.html","/web/cards.html","/web/transfers.html","/web/create-cards.html", "/web/loan-application.html").hasAuthority("CLIENT")

                .antMatchers(HttpMethod.POST, "/api/clients/current/accounts","/api/clients/current/cards","/api/transactions/**","/api/loans","/api/cards/delete","/api/accounts/delete").hasAuthority("CLIENT")

                .antMatchers(HttpMethod.POST, "/api/clients").permitAll()

                .antMatchers(HttpMethod.GET, "/api/clients/current/**","/api/loans").hasAnyAuthority("CLIENT")

                .antMatchers("/admin/**","/rest/**","/h2-console/**","/manager.html").hasAuthority("ADMIN")
                .antMatchers("/api/**").hasAuthority("ADMIN")
                .antMatchers(HttpMethod.GET, "/api/transactions/generate").hasAnyAuthority("ADMIN")
                .antMatchers(HttpMethod.POST,"/api/loans/createLoan").hasAuthority("ADMIN")
;


        http.formLogin()

                .usernameParameter("email")

                .passwordParameter("password")

                .loginPage("/api/login");


        http.logout().logoutUrl("/api/logout");


        // turn off checking for CSRF tokens

        http.csrf().disable();


        http.cors().configurationSource(request -> new CorsConfiguration().applyPermitDefaultValues());

        //disabling frameOptions so h2-console can be accessed

        http.headers().frameOptions().disable();

        // if user is not authenticated, just send an authentication failure response

        http.exceptionHandling().authenticationEntryPoint((req, res, exc) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED));

        // if login is successful, just clear the flags asking for authentication

        http.formLogin().successHandler((req, res, auth) -> clearAuthenticationAttributes(req));

        // if login fails, just send an authentication failure response

        http.formLogin().failureHandler((req, res, exc) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED));

        // if logout is successful, just send a success response

        http.logout().logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler());

    }
    private void clearAuthenticationAttributes(HttpServletRequest request) {

        HttpSession session = request.getSession(false);

        if (session != null) {

            session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);

        };
    };
}



