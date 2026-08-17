package br.com.fintech.fintech_api.service;

import br.com.fintech.fintech_api.model.Categoria;
import br.com.fintech.fintech_api.model.Despesa;
import br.com.fintech.fintech_api.model.Usuario;
import br.com.fintech.fintech_api.repository.CategoriaRepository;
import br.com.fintech.fintech_api.repository.DespesaRepository;
import br.com.fintech.fintech_api.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DespesaService {

    private final DespesaRepository repository;
    private final UsuarioRepository usuarioRepository;
    private final CategoriaRepository categoriaRepository;

    public DespesaService(DespesaRepository repository,
                          UsuarioRepository usuarioRepository,
                          CategoriaRepository categoriaRepository) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
        this.categoriaRepository = categoriaRepository;
    }

    public List<Despesa> listarTodos() {
        return repository.findAll();
    }

    public List<Despesa> listarPorUsuario(Long idUsuario) {
        return repository.findByUsuarioIdUsuario(idUsuario);
    }

    public Despesa buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Despesa não encontrada"));
    }

    public Despesa salvar(Despesa despesa) {
        Usuario usuario = usuarioRepository.findById(despesa.getUsuario().getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        Categoria categoria = categoriaRepository.findById(despesa.getCategoria().getIdCategoria())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
        despesa.setUsuario(usuario);
        despesa.setCategoria(categoria);
        return repository.save(despesa);
    }

    public Despesa atualizar(Long id, Despesa dados) {
        Despesa despesa = buscarPorId(id);
        despesa.setDescricao(dados.getDescricao());
        despesa.setValor(dados.getValor());
        despesa.setDataGasto(dados.getDataGasto());
        if (dados.getCategoria() != null) {
            Categoria categoria = categoriaRepository.findById(dados.getCategoria().getIdCategoria())
                    .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
            despesa.setCategoria(categoria);
        }
        return repository.save(despesa);
    }

    public void deletar(Long id, Long idUsuario) {
        Despesa despesa = buscarPorId(id);
        if (!despesa.getUsuario().getIdUsuario().equals(idUsuario)) {
            throw new RuntimeException("Você não tem permissão para excluir esta despesa.");
        }
        repository.deleteById(id);
    }
}