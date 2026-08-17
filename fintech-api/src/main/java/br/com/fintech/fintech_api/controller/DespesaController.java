package br.com.fintech.fintech_api.controller;

import br.com.fintech.fintech_api.model.Despesa;
import br.com.fintech.fintech_api.service.DespesaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/despesas")
public class DespesaController {

    private final DespesaService despesaService;

    public DespesaController(DespesaService despesaService) {
        this.despesaService = despesaService;
    }

    @GetMapping
    public ResponseEntity<List<Despesa>> listarTodos() {
        return ResponseEntity.ok(despesaService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Despesa> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(despesaService.buscarPorId(id));
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Despesa>> listarPorUsuario(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(despesaService.listarPorUsuario(idUsuario));
    }

    @PostMapping
    public ResponseEntity<Despesa> salvar(@Valid @RequestBody Despesa despesa) {
        return ResponseEntity.status(HttpStatus.CREATED).body(despesaService.salvar(despesa));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Despesa> atualizar(@PathVariable Long id,
                                             @Valid @RequestBody Despesa despesa) {
        return ResponseEntity.ok(despesaService.atualizar(id, despesa));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id,
            @RequestParam Long idUsuario) {
        despesaService.deletar(id, idUsuario);
        return ResponseEntity.noContent().build();
    }
}