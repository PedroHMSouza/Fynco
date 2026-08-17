package br.com.fintech.fintech_api.controller;

import br.com.fintech.fintech_api.model.Conta;
import br.com.fintech.fintech_api.service.ContaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/contas")
public class ContaController {

    private final ContaService contaService;

    public ContaController(ContaService contaService) {
        this.contaService = contaService;
    }

    @GetMapping
    public ResponseEntity<List<Conta>> listarTodos() {
        return ResponseEntity.ok(contaService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Conta> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(contaService.buscarPorId(id));
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Conta>> listarPorUsuario(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(contaService.listarPorUsuario(idUsuario));
    }

    @PostMapping
    public ResponseEntity<Conta> salvar(@Valid @RequestBody Conta conta) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contaService.salvar(conta));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Conta> atualizar(@PathVariable Long id,
                                           @Valid @RequestBody Conta conta) {
        return ResponseEntity.ok(contaService.atualizar(id, conta));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        contaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}