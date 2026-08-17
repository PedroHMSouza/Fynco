package br.com.fintech.fintech_api.service;

import br.com.fintech.fintech_api.model.Categoria;
import br.com.fintech.fintech_api.model.Receita;
import br.com.fintech.fintech_api.model.Usuario;
import br.com.fintech.fintech_api.repository.CategoriaRepository;
import br.com.fintech.fintech_api.repository.ReceitaRepository;
import br.com.fintech.fintech_api.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReceitaService {

    private final ReceitaRepository repository;
    private final UsuarioRepository usuarioRepository;
    private final CategoriaRepository categoriaRepository;

    public ReceitaService(ReceitaRepository repository,
                          UsuarioRepository usuarioRepository,
                          CategoriaRepository categoriaRepository) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
        this.categoriaRepository = categoriaRepository;
    }

    public List<Receita> listarTodos() {
        return repository.findAll();
    }

    public List<Receita> listarPorUsuario(Long idUsuario) {
        return repository.findByUsuarioIdUsuario(idUsuario);
    }

    public Receita buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receita não encontrada"));
    }

    public Receita salvar(Receita receita) {
        Usuario usuario = usuarioRepository.findById(receita.getUsuario().getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        Categoria categoria = categoriaRepository.findById(receita.getCategoria().getIdCategoria())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
        receita.setUsuario(usuario);
        receita.setCategoria(categoria);
        return repository.save(receita);
    }

    public Receita atualizar(Long id, Receita dados) {
        Receita receita = buscarPorId(id);
        receita.setDescricao(dados.getDescricao());
        receita.setValor(dados.getValor());
        receita.setDataRecebimento(dados.getDataRecebimento());
        if (dados.getCategoria() != null) {
            Categoria categoria = categoriaRepository.findById(dados.getCategoria().getIdCategoria())
                    .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
            receita.setCategoria(categoria);
        }
        return repository.save(receita);
    }

    public void deletar(Long id, Long idUsuario) {
        Receita receita = buscarPorId(id);
        if (!receita.getUsuario().getIdUsuario().equals(idUsuario)) {
            throw new RuntimeException("Você não tem permissão para excluir esta receita.");
        }
        repository.deleteById(id);
    }
}