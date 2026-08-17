package br.com.fintech.fintech_api.repository;

import br.com.fintech.fintech_api.model.Despesa;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DespesaRepository extends JpaRepository<Despesa, Long> {
    List<Despesa> findByUsuarioIdUsuario(Long idUsuario);
}