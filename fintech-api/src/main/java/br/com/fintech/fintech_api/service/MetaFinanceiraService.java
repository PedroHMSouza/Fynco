package br.com.fintech.fintech_api.service;

import br.com.fintech.fintech_api.model.MetaFinanceira;
import br.com.fintech.fintech_api.model.Usuario;
import br.com.fintech.fintech_api.repository.MetaFinanceiraRepository;
import br.com.fintech.fintech_api.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;

@Service
public class MetaFinanceiraService {

    private final MetaFinanceiraRepository repository;
    private final UsuarioRepository usuarioRepository;

    public MetaFinanceiraService(MetaFinanceiraRepository repository,
                                 UsuarioRepository usuarioRepository) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<MetaFinanceira> listarTodos() {
        return repository.findAll();
    }

    public List<MetaFinanceira> listarPorUsuario(Long idUsuario) {
        return repository.findByUsuarioIdUsuario(idUsuario);
    }

    public MetaFinanceira buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meta não encontrada"));
    }

    public MetaFinanceira salvar(MetaFinanceira meta) {
        Usuario usuario = usuarioRepository.findById(meta.getUsuario().getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        meta.setUsuario(usuario);
        return repository.save(meta);
    }

    public MetaFinanceira atualizar(Long id, MetaFinanceira dados) {
        MetaFinanceira meta = buscarPorId(id);
        meta.setDescricaoMeta(dados.getDescricaoMeta());
        meta.setValorObjetivo(dados.getValorObjetivo());
        meta.setDataFim(dados.getDataFim());
        return repository.save(meta);
    }

    public MetaFinanceira adicionarProgresso(Long id, BigDecimal valor) {
        MetaFinanceira meta = buscarPorId(id);
        meta.setValorAtual(meta.getValorAtual().add(valor));
        return repository.save(meta);
    }

    public void deletar(Long id, Long idUsuario) {
        MetaFinanceira meta = buscarPorId(id);
        if (!meta.getUsuario().getIdUsuario().equals(idUsuario)) {
            throw new RuntimeException("Você não tem permissão para excluir esta meta.");
        }
        repository.deleteById(id);
    }
}