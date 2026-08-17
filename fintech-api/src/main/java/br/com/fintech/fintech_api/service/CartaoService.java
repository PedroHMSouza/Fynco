package br.com.fintech.fintech_api.service;

import br.com.fintech.fintech_api.model.Cartao;
import br.com.fintech.fintech_api.model.Conta;
import br.com.fintech.fintech_api.repository.CartaoRepository;
import br.com.fintech.fintech_api.repository.ContaRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CartaoService {

    private final CartaoRepository repository;
    private final ContaRepository contaRepository;

    public CartaoService(CartaoRepository repository, ContaRepository contaRepository) {
        this.repository = repository;
        this.contaRepository = contaRepository;
    }

    public List<Cartao> listarTodos() {
        return repository.findAll();
    }

    public List<Cartao> listarPorConta(Long idConta) {
        return repository.findByContaIdConta(idConta);
    }

    public Cartao buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cartão não encontrado"));
    }

    public Cartao salvar(Cartao cartao) {
        Conta conta = contaRepository.findById(cartao.getConta().getIdConta())
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));
        cartao.setConta(conta);
        return repository.save(cartao);
    }

    public Cartao atualizar(Long id, Cartao dados) {
        Cartao cartao = buscarPorId(id);
        cartao.setTipoCartao(dados.getTipoCartao());
        cartao.setBandeira(dados.getBandeira());
        cartao.setLimite(dados.getLimite());
        cartao.setFechamentoFatura(dados.getFechamentoFatura());
        return repository.save(cartao);
    }

    public void deletar(Long id) {
        buscarPorId(id);
        repository.deleteById(id);
    }
}