package br.com.fintech.fintech_api.controller;

import br.com.fintech.fintech_api.model.Cartao;
import br.com.fintech.fintech_api.service.CartaoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cartoes")
public class CartaoController {

    private final CartaoService cartaoService;

    public CartaoController(CartaoService cartaoService) {
        this.cartaoService = cartaoService;
    }

    @GetMapping
    public ResponseEntity<List<Cartao>> listarTodos() {
        return ResponseEntity.ok(cartaoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cartao> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(cartaoService.buscarPorId(id));
    }

    @GetMapping("/conta/{idConta}")
    public ResponseEntity<List<Cartao>> listarPorConta(@PathVariable Long idConta) {
        return ResponseEntity.ok(cartaoService.listarPorConta(idConta));
    }

    @PostMapping
    public ResponseEntity<Cartao> salvar(@Valid @RequestBody Cartao cartao) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cartaoService.salvar(cartao));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cartao> atualizar(@PathVariable Long id,
                                            @Valid @RequestBody Cartao cartao) {
        return ResponseEntity.ok(cartaoService.atualizar(id, cartao));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        cartaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}