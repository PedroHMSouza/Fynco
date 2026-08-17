package br.com.fintech.fintech_api.service;

import br.com.fintech.fintech_api.model.Conta;
import br.com.fintech.fintech_api.model.Usuario;
import br.com.fintech.fintech_api.repository.ContaRepository;
import br.com.fintech.fintech_api.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ContaService {

    private final ContaRepository repository;
    private final UsuarioRepository usuarioRepository;

    public ContaService(ContaRepository repository, UsuarioRepository usuarioRepository) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<Conta> listarTodos() {
        return repository.findAll();
    }

    public List<Conta> listarPorUsuario(Long idUsuario) {
        return repository.findByUsuarioIdUsuario(idUsuario);
    }

    public Conta buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));
    }

    public Conta salvar(Conta conta) {
        Usuario usuario = usuarioRepository.findById(conta.getUsuario().getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        conta.setUsuario(usuario);
        return repository.save(conta);
    }

    public Conta atualizar(Long id, Conta dados) {
        Conta conta = buscarPorId(id);
        conta.setBanco(dados.getBanco());
        conta.setTipoConta(dados.getTipoConta());
        conta.setNomeConta(dados.getNomeConta());
        conta.setSaldoAtual(dados.getSaldoAtual());
        return repository.save(conta);
    }

    public void deletar(Long id) {
        buscarPorId(id);
        repository.deleteById(id);
    }
}