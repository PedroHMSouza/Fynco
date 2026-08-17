package br.com.fintech.fintech_api.repository;

import br.com.fintech.fintech_api.model.MetaFinanceira;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MetaFinanceiraRepository extends JpaRepository<MetaFinanceira, Long> {
    List<MetaFinanceira> findByUsuarioIdUsuario(Long idUsuario);
}