package br.com.fintech.fintech_api.repository;

import br.com.fintech.fintech_api.model.Cartao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CartaoRepository extends JpaRepository<Cartao, Long> {
    List<Cartao> findByContaIdConta(Long idConta);
}