package br.com.fintech.fintech_api.repository;

import br.com.fintech.fintech_api.model.Investimento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InvestimentoRepository extends JpaRepository<Investimento, Long> {
    List<Investimento> findByUsuarioIdUsuario(Long idUsuario);
}