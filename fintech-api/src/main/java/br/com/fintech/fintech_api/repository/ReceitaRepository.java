package br.com.fintech.fintech_api.repository;

import br.com.fintech.fintech_api.model.Receita;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReceitaRepository extends JpaRepository<Receita, Long> {
    List<Receita> findByUsuarioIdUsuario(Long idUsuario);
}