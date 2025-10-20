package com.example.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@OpenAPIDefinition(info = @Info(title = "API Plataforma de Cursos", version = "v1"))
@SpringBootApplication
public class CadastroeGerenciamentoApplication {

	public static void main(String[] args) {
		SpringApplication.run(CadastroeGerenciamentoApplication.class, args);
	}

}
