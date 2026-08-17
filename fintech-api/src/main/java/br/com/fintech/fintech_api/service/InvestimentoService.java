package br.com.fintech.fintech_api.service;

import br.com.fintech.fintech_api.model.Investimento;
import br.com.fintech.fintech_api.model.Usuario;
import br.com.fintech.fintech_api.repository.InvestimentoRepository;
import br.com.fintech.fintech_api.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;

@Service
public class InvestimentoService {

    private final InvestimentoRepository repository;
    private final UsuarioRepository usuarioRepository;

    public InvestimentoService(InvestimentoRepository repository,
                               UsuarioRepository usuarioRepository) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<Investimento> listarTodos() {
        return repository.findAll();
    }

    public List<Investimento> listarPorUsuario(Long idUsuario) {
        return repository.findByUsuarioIdUsuario(idUsuario);
    }

    public Investimento buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Investimento não encontrado"));
    }

    public Investimento salvar(Investimento investimento) {
        Usuario usuario = usuarioRepository.findById(investimento.getUsuario().getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        investimento.setUsuario(usuario);
        return repository.save(investimento);
    }

    public Investimento atualizar(Long id, Investimento dados) {
        Investimento investimento = buscarPorId(id);
        investimento.setTipo(dados.getTipo());
        investimento.setValor(dados.getValor());
        investimento.setTaxa(dados.getTaxa());
        investimento.setDataInvestimento(dados.getDataInvestimento());
        return repository.save(investimento);
    }

    public void deletar(Long id, Long idUsuario) {
        Investimento investimento = buscarPorId(id);
        if (!investimento.getUsuario().getIdUsuario().equals(idUsuario)) {
            throw new RuntimeException("Você não tem permissão para excluir este investimento.");
        }
        repository.deleteById(id);
    }

    public BigDecimal calcularRendimento(Long id) {
        Investimento investimento = buscarPorId(id);
        return investimento.getValor().multiply(investimento.getTaxa());
    }
}