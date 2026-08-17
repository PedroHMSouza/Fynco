package br.com.fintech.fintech_api.repository;

import br.com.fintech.fintech_api.model.Conta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContaRepository extends JpaRepository<Conta, Long> {
    List<Conta> findByUsuarioIdUsuario(Long idUsuario);
}