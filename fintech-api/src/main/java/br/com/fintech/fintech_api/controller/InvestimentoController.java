package br.com.fintech.fintech_api.controller;

import br.com.fintech.fintech_api.model.Investimento;
import br.com.fintech.fintech_api.service.InvestimentoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/investimentos")
public class InvestimentoController {

    private final InvestimentoService investimentoService;

    public InvestimentoController(InvestimentoService investimentoService) {
        this.investimentoService = investimentoService;
    }

    @GetMapping
    public ResponseEntity<List<Investimento>> listarTodos() {
        return ResponseEntity.ok(investimentoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Investimento> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(investimentoService.buscarPorId(id));
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Investimento>> listarPorUsuario(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(investimentoService.listarPorUsuario(idUsuario));
    }

    @GetMapping("/{id}/rendimento")
    public ResponseEntity<BigDecimal> calcularRendimento(@PathVariable Long id) {
        return ResponseEntity.ok(investimentoService.calcularRendimento(id));
    }

    @PostMapping
    public ResponseEntity<Investimento> salvar(@Valid @RequestBody Investimento investimento) {
        return ResponseEntity.status(HttpStatus.CREATED).body(investimentoService.salvar(investimento));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Investimento> atualizar(@PathVariable Long id,
                                                  @Valid @RequestBody Investimento investimento) {
        return ResponseEntity.ok(investimentoService.atualizar(id, investimento));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id,
            @RequestParam Long idUsuario) {
        investimentoService.deletar(id, idUsuario);
        return ResponseEntity.noContent().build();
    }
}