package br.com.fintech.fintech_api.controller;

import br.com.fintech.fintech_api.model.Receita;
import br.com.fintech.fintech_api.service.ReceitaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/receitas")
public class ReceitaController {

    private final ReceitaService receitaService;

    public ReceitaController(ReceitaService receitaService) {
        this.receitaService = receitaService;
    }

    @GetMapping
    public ResponseEntity<List<Receita>> listarTodos() {
        return ResponseEntity.ok(receitaService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Receita> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(receitaService.buscarPorId(id));
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Receita>> listarPorUsuario(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(receitaService.listarPorUsuario(idUsuario));
    }

    @PostMapping
    public ResponseEntity<Receita> salvar(@Valid @RequestBody Receita receita) {
        return ResponseEntity.status(HttpStatus.CREATED).body(receitaService.salvar(receita));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Receita> atualizar(@PathVariable Long id,
                                             @Valid @RequestBody Receita receita) {
        return ResponseEntity.ok(receitaService.atualizar(id, receita));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id,
            @RequestParam Long idUsuario) {
        receitaService.deletar(id, idUsuario);
        return ResponseEntity.noContent().build();
    }
}